export default function Anim (duration, data) {
  let done = false
  let time = 0
  return {
    data,
    update () {
      if (done) return -1
      const t = time / (duration - 1)
      if (++time === duration) {
        done = true
      }
      return t
    }
  }
}
