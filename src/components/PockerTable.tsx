import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useRealtimeData, type Card } from "../hooks/useRealtimeData";
import { writeData } from "../services/firebase";
import { Loading } from "./Loading";

enum TableStatus {
  NEW = "new",
  READY = "ready",
  REVEALING = "revealing",
  REVEALED = "revealed",
}

function dealCards(deck: Array<Card>) {
  const left: Array<Card> = [];
  const right: Array<Card> = [];
  const top: Array<Card> = [];
  const bottom: Array<Card> = [];

  if (deck.length === 1) {
    top.push(deck[0]);
  } else if (deck.length === 2) {
    top.push(deck[0]);
    bottom.push(deck[1]);
  } else if (deck.length > 2) {
    left.push(deck[0]);
    right.push(deck[1]);
    const remaining = deck.slice(2);
    const half = Math.ceil(remaining.length / 2);
    top.push(...remaining.slice(0, half));
    bottom.push(...remaining.slice(half));
  }

  return { left, right, top, bottom };
}

function CountDown(props: { onClick: () => void; onFinished: () => void }) {
  const [count, setCount] = useState(3);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (count > 0) {
      const timer = setTimeout(() => setCount(count - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setDone(true);
    }
  }, [count]);

  useEffect(() => {
    if (done) {
      props.onFinished();
    }
  }, [done]);

  return (
    <div className="animate-ping duration-1000 text-3xl md:text-4xl lg:text-5xl">
      {count}
    </div>
  );
}

export function PockerTable() {
  const [searchParams] = useSearchParams();
  const roomId = searchParams.get("room");
  const userId = localStorage.getItem("id");
  const [status, setStatus] = useState<string>(TableStatus.NEW);
  const [selectedCard, setSelectedCard] = useState<string>("");
  const { data, loading, error } = useRealtimeData(`/${roomId}`);
  const cardDeck = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];

  useEffect(() => {
    if (data.some((item) => item.status === "new")) {
      const foundCard = data.filter((item) => item.userId === userId);
      const myCard = foundCard.length > 0 ? foundCard[0] : undefined;
      setSelectedCard(myCard?.vote ?? "");
      setStatus(TableStatus.NEW);
    }

    if (data.some((item) => item.vote)) {
      setStatus(TableStatus.READY);
    }

    if (data.some((item) => item.status === "revealing")) {
      setStatus(TableStatus.REVEALING);
    }

    if (data.some((item) => item.status === "revealed")) {
      setStatus(TableStatus.REVEALED);
    }
  }, [JSON.stringify(data)]);

  const voteResults = useMemo(() => {
    const map = new Map<number, number>();

    data.forEach((card) => {
      const vote = Number(card.vote);
      map.set(vote, (map.get(vote) ?? 0) + 1);
    });

    const results = Array.from(map)
      .filter(([vote]) => vote !== 0)
      .sort((a, b) => a[0] - b[0]);
    const totalVotes = results.reduce(
      (sum, [vote, count]) => sum + vote * count,
      0
    );
    const totalCount = results.reduce((sum, [_, count]) => sum + count, 0);
    const average = totalCount > 0 ? (totalVotes / totalCount).toFixed(1) : "0";

    return { results, average };
  }, [JSON.stringify(data)]);

  const onSelectCard = (point: string) => {
    if (selectedCard && selectedCard === point) {
      writeData(`/${roomId}/${userId}/vote`, "");
      setSelectedCard("");
    } else {
      writeData(`/${roomId}/${userId}/vote`, point);
      setSelectedCard(point);
    }
  };
  const onRevealCard = () => {
    writeData(`/${roomId}/${userId}/status`, TableStatus.REVEALING);
  };
  const onRevealedCard = () => {
    writeData(`/${roomId}/${userId}/status`, TableStatus.REVEALED);
  };
  const onStartNew = () => {
    data.map((item) => {
      writeData(`/${roomId}/${item.userId}`, {
        name: item.name,
        status: TableStatus.NEW,
        vote: "",
      });
    });
  };

  if (loading) return <Loading />;
  if (error) return <p>Error: {error.message}</p>;

  const { left, top, right, bottom } = dealCards(data);

  return (
    <div className="container mx-auto px-2 flex flex-col grow">
      <div className="flex justify-center items-center grow">
        <div className="grid grid-cols-4 gap-7">
          <div className="col-span-4">
            <div className="flex justify-center items-center h-20 gap-10">
              {top.map((card, index) => (
                <div key={index} className="flex flex-col items-center gap-2">
                  <div
                    className={`${
                      Boolean(card.vote) && status !== TableStatus.REVEALED
                        ? "voted"
                        : "bg-slate-700 border-2 border-sky-500"
                    } card flex justify-center items-center w-9 h-15 rounded-lg font-bold`}
                  >
                    {status === TableStatus.REVEALED ? card.vote : ""}
                  </div>
                  <div className="font-bold">{card.name}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col justify-center items-end">
            {left.map((card, index) => (
              <div key={index} className="flex flex-col items-center gap-2">
                <div
                  className={`${
                    Boolean(card.vote) && status !== TableStatus.REVEALED
                      ? "voted"
                      : "bg-slate-700 border-2 border-sky-500"
                  } card flex justify-center items-center w-9 h-15 rounded-lg font-bold`}
                >
                  {status === TableStatus.REVEALED ? card.vote : ""}
                </div>
                <div className="font-bold">{card.name}</div>
              </div>
            ))}
          </div>
          <div className="col-span-2">
            <div
              className={`${status === TableStatus.READY ? "glowing" : ""}
               relative flex justify-center items-center p-4 min-w-40 min-h-20 min-lg:w-80 min-lg:h-40 min-md:w-60 min-md:h-30 bg-slate-700 rounded-2xl`}
            >
              {status === TableStatus.NEW && <p>Pick your cards!</p>}
              {status === TableStatus.READY && (
                <button
                  className="bg-sky-600 hover:bg-sky-500 rounded-lg py-3 px-4 cursor-pointer"
                  onClick={onRevealCard}
                >
                  Reveal cards
                </button>
              )}
              {status === TableStatus.REVEALING && (
                <CountDown onClick={onStartNew} onFinished={onRevealedCard} />
              )}
              {status === TableStatus.REVEALED && (
                <button
                  onClick={onStartNew}
                  className="bg-slate-500 hover:bg-slate-400 rounded-lg py-3 px-4 cursor-pointer"
                >
                  Start new voting
                </button>
              )}
            </div>
          </div>
          <div className="flex justify-start items-center">
            {right.map((card, index) => (
              <div key={index} className="flex flex-col items-center gap-2">
                <div
                  className={`${
                    Boolean(card.vote) && status !== TableStatus.REVEALED
                      ? "voted"
                      : "bg-slate-700 border-2 border-sky-500"
                  } card flex justify-center items-center w-9 h-15 rounded-lg font-bold`}
                >
                  {status === TableStatus.REVEALED ? card.vote : ""}
                </div>
                <div className="font-bold">{card.name}</div>
              </div>
            ))}
          </div>
          <div className="col-span-4">
            <div className="flex justify-center items-center h-20 gap-10">
              {bottom.map((card, index) => (
                <div key={index} className="flex flex-col items-center gap-2">
                  <div
                    className={`${
                      Boolean(card.vote) && status !== TableStatus.REVEALED
                        ? "voted"
                        : "bg-slate-700 border-2 border-sky-500"
                    } card flex justify-center items-center w-9 h-15 rounded-lg font-bold`}
                  >
                    {status === TableStatus.REVEALED ? card.vote : ""}
                  </div>
                  <div className="font-bold">{card.name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {status === TableStatus.REVEALED ? (
        <div className="flex justify-center py-10 gap-5">
          {voteResults.results.map(([key, value], index) => (
            <div key={index} className="flex flex-col items-center gap-2">
              <div className="flex justify-center items-center w-14 h-24 rounded-lg border-2 border-white text-lg">
                {key}
              </div>
              <div>
                {value} {value > 1 ? "votes" : "vote"}
              </div>
            </div>
          ))}
          <div className="flex flex-col items-center ml-4">
            <p className="mb-1">Average:</p>
            <p className="font-bold text-4xl text-sky-500">
              {voteResults.average}
            </p>
          </div>
        </div>
      ) : (
        <div className="pt-7 pb-10">
          <p className="text-center mb-7">Choose your card 👇</p>
          <div className="flex flex-wrap justify-center items-center gap-4">
            {cardDeck.map((deck) => (
              <button
                key={deck}
                className={`${
                  selectedCard === deck
                    ? "bg-sky-500 text-white hover:bg-sky-500"
                    : "hover:bg-slate-700"
                } cursor-pointer flex justify-center items-center w-14 h-24 rounded-lg border-2 border-sky-500 text-sky-500 text-lg hover:-translate-y-1 transition-transform`}
                onClick={() => onSelectCard(deck)}
              >
                {deck}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
