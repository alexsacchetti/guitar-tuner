import { useState } from 'react'
import { motion } from 'framer-motion'

export default function animateTuner() {
  const [x, setX] = useState(0)
  const [y, setY] = useState(0)
  const [rotate, setRotate] = useState(0)

  return (
    <div className="example">
      <div>
        <motion.div className="box" animate={{ x, y, rotate }} transition={{ type: 'spring' }} />
      </div>
    </div>
  )
}
