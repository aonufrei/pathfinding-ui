import { useEffect } from "react";
import { useState } from "react";

const PlaybackPanel = ({frames, onRender, delay}) => {

    const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
    const [run, setRun] = useState(false)

    useEffect(() => {
        // const interval = setInterval(_ => console.log(run), delay)
        // // onFrameChanged(frame)
        // return () => {
        //     clearInterval(interval)
        // }
    }, [])

    const renderFrame = (index) => {
        if (run === false) {
            return
        }

        setTimeout(onRender(frames[currentFrameIndex]))

    }

    const renderOnInterval = () => {
        if (run === false) {
            console.log("playback is stopped")
            return
        }
        if (currentFrameIndex >= frames.length) {
            setRun(false)
            return
        }

        onRender(frames[currentFrameIndex])
        setCurrentFrameIndex(currentFrameIndex + 1);
    }

    const onPlayClicked = () => {
        if (currentFrameIndex >= frames.length) {
            setCurrentFrameIndex(0)
        }
        setRun(true)
    }

    useEffect(() => {
    }, [run])

    return (<div>
        <button onClick={run === false ? onPlayClicked : _ => setRun(false)}>{run === true ? "Stop" : "Play"}</button>
    </div>)
}

export default PlaybackPanel;