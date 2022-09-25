import { useEffect, useState } from "react";

export interface Maschine {
    nummer: number;
    start: number
    dauer: number
    gebaeude: string
}

export const Maschine = ({ start, dauer, nummer, gebaeude }: Maschine) => {
    const [startWert, setStartWert] = useState(start);
    const [dauerWert, setDauerWert] = useState(dauer);
    const ende = startWert + dauerWert * 60 * 1000;
    const [restZeit, setRestZeit] = useState(ende - Date.now());

    useEffect(() => {
        const interval = setInterval(() => {
            setRestZeit(ende - Date.now());
        }, 1000);
        return () => clearInterval(interval);
    }, [ende]);

    const restMinuten = Math.floor(restZeit / 1000 / 60).toString().padStart(2, "0")
    const restSekunden = Math.floor(restZeit / 1000 % 60).toString().padStart(2, "0")
    const laufend = restZeit > 0
    const endeZeit = new Date(ende).toLocaleTimeString("de-DE", { timeZone: "Europe/Berlin" }).slice(0, -3)

    return (
        <div className={`p-3 rounded shadow-lg ${laufend ? "bg-red-300" : "bg-green-300"}`}>
            <p>
                <span>Maschine {nummer} </span>
                {
                    laufend ?
                        <span>
                            läuft noch {restMinuten}:{restSekunden} bis {endeZeit}.
                        </span>
                        :
                        <span>
                            ist fertig seit {endeZeit}.
                        </span>
                }
            </p>
            <form
                className="flex gap-1 mt-2 h-8"
                onSubmit={
                    async (event) => {
                        event.preventDefault()

                        fetch("/api/start",
                            {
                                body: JSON.stringify({
                                    nummer,
                                    gebaeude,
                                    start: Number(Date.now()),
                                    dauer: event.currentTarget.dauer?.valueAsNumber || 0
                                }),
                                method: "POST"
                            }
                        )

                        setStartWert(Date.now())
                        setDauerWert(event.currentTarget.dauer?.value || 0)
                        setRestZeit((Date.now() + event.currentTarget.dauer?.value * 60 * 1000) - Date.now());
                        event.currentTarget.reset()
                    }}>
                {!laufend && <input
                    disabled={laufend}
                    className="grow rounded-lg text-center focus:outline-gray-300"
                    type="number"
                    name="dauer"
                    step={5}
                    min={0}
                    max={100}
                    defaultValue={laufend ? "" : 60}
                    placeholder="Dauer" />}
                <button
                    className={`grow rounded-lg ${laufend ? "bg-red-500" : "bg-blue-300"}`}
                    type="submit">
                    {laufend ? "stop" : "start"}
                </button>
            </form>
        </div >
    )
}