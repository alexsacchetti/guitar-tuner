import React, { memo, useEffect, useRef, useState } from 'react'
import { getTuningInfo, initAudio, initTuner } from '@ddlab/tuner'
import { lookup } from 'dns'
import { motion } from 'framer-motion'
import AudioBars from './AudioBars'

const Tune: React.FC<{}> = (props) => {
  const [displayNote, setDisplayNote] = useState<string>('...')
  const [displayCents, setDisplayCents] = useState<number>(0)
  const [displayTune, setDisplayTune] = useState<string>('Not Tuned Yet')
  const [loopId, setLoopId] = useState<any>('')
  const [isTune, setIsTune] = useState<string>('')
  const [isTuning, setIsTuning] = useState<boolean>(false)
  const [deltaState, setDeltaState] = useState<any>()
  const [rotate, setRotate] = useState<any>('')
  const [isPressed, setIsPressed] = useState(false)

  // const audioShow = useRef(null)

  const initAudioStream = async () => {
    const { getFreqData, deltaFreq } = await initAudio()
    const loop = () => {
      const { noteStr, cents, isInTune } = getTuningInfo(getFreqData(), deltaFreq)

      setLoopId(requestAnimationFrame(loop))
      // setIsTuning(true)
      if (isNaN(cents) || !noteStr || noteStr === '-') {
        setDisplayTune('NO SOUND')
        setDisplayCents(0)
      } else {
        console.log(cents, noteStr)
        setDisplayNote(noteStr)
        setDisplayCents(cents)
        setRotate(cents)
        setDisplayTune(isInTune)
        setIsTuning(true)
        if (isInTune) {
          setIsTune('In Tune!!!')
        } else {
          setIsTune('')
        }
      }
    }
    loop()
  }

  const endAudioStream = () => {
    console.log('ending the audio stream!!!')
    setIsTuning(false)
    cancelAnimationFrame(loopId)
  }

  const toggleAudioStream = () => {
    if (isTuning) {
      endAudioStream()
    } else {
      initAudioStream()
    }
    setIsTuning(!isTuning)
    setIsPressed(!isPressed)
  }

  // const getHue = (displayCents: number) => {
  //   const minCents = -50
  //   const maxCents = 50
  //   const hue = ((displayCents - minCents) / (maxCents - minCents)) * 120 // 120 is the hue for green in HSL
  //   return hue
  // }

  // const leftHue = getHue(Math.max(-50, Math.min(0, displayCents)))
  // const rightHue = getHue(Math.max(0, Math.min(50, displayCents)))

  const getHue = (displayCents: number, isLeft: boolean) => {
    const minCents = isLeft ? -50 : 0
    const maxCents = isLeft ? 0 : 50
    // For the left arc, the hue should go from 0 (red) at -50 to 120 (green) at 0
    // For the right arc, the hue should go from 120 (green) at 0 to 0 (red) at 50
    const hue = isLeft
      ? ((displayCents - minCents) / (maxCents - minCents)) * 120
      : 120 - ((displayCents - minCents) / (maxCents - minCents)) * 120
    return hue
  }

  const leftHue = getHue(Math.max(-50, Math.min(0, displayCents)), true)
  const rightHue = getHue(Math.max(0, Math.min(50, displayCents)), false)

  return (
    <div className="tuner-container">
      <div className="tuner-title">Instrument Tuner</div>
      <div className="tuner">
        <div className="screen">
          {/* Existing tuner elements */}
          <div className="displayNote">{displayNote}</div>
          <div className="">
            <div className="animate">
              <svg width="400" height="200">
                <path
                  id="leftArc"
                  d="M200,100 A100,100 0 0,0 100,200"
                  fill="none"
                  stroke={`hsl(${leftHue}, 100%, 50%)`}
                  strokeWidth="10"
                />
                <path
                  id="rightArc"
                  d="M200,100 A100,100 0 0,1 300,200"
                  fill="none"
                  stroke={`hsl(${rightHue}, 100%, 50%)`}
                  strokeWidth="10"
                />
              </svg>

              <div>
                <motion.div
                  className={`triangle-up ${isTune ? 'green' : ''}`}
                  initial={{ rotate: 0 }}
                  animate={{ rotate }}
                  transition={{ type: 'spring' }}
                />
              </div>
            </div>
          </div>
          <div>{displayCents}</div>
          <AudioBars isAnimating={isTuning} />
        </div>
        <div
          className={`footswitch ${isPressed ? 'pressed' : ''}`}
          onMouseDown={() => setIsPressed(true)}
          onMouseUp={() => setIsPressed(false)}
          onMouseLeave={() => setIsPressed(false)}
        >
          <button className="button" type="button" onClick={toggleAudioStream}>
            {isTuning ? 'Stop' : 'Start'}
          </button>
        </div>
      </div>
    </div>

    // <div>
    //   <div className="frame">
    //     {/* <div className="audio" ref={audioShow}></div> */}
    //     <div className="container">
    // <div className="tuneNote">{displayNote}</div>
    // <div className="tuner-frame">
    //   <div className="animate">
    //     <div>
    //       <motion.div
    //         className={`triangle-up ${isTune ? 'green' : ''}`}
    //         animate={{ rotate }}
    //         transition={{ type: 'spring' }}
    //       />
    //     </div>
    //   </div>
    // </div>
    //       <AudioBars isAnimating={isTuning} />
    //       <div className="tunerInfo">
    //         {displayCents} cents <br></br>
    //         {isTune}
    //       </div>
    // <div className="button-container">
    //   <button className="button" type="button" onClick={initAudioStream}>
    //     Start
    //   </button>
    //   <button className="button" type="button" onClick={endAudioStream}>
    //     Stop
    //   </button>
    // </div>
    //     </div>
    //   </div>
    // </div>
  )
}

export default memo(Tune)
