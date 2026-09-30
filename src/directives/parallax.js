const items = new Set()
let raf = 0

function tick() {
  raf = 0
  const vh = window.innerHeight
  items.forEach((el) => {
    const f = el._parallaxFactor || 0
    const p = el.parentElement.getBoundingClientRect()
    if (p.bottom < -200 || p.top > vh + 200) return
    el.style.transform = `translate3d(0,${(p.top + p.height / 2 - vh / 2) * -f}px,0)`
  })
}
function onScroll() {
  if (!raf) raf = requestAnimationFrame(tick)
}

if (typeof window !== 'undefined') {
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll)
}

export const parallax = {
  mounted(el, binding) {
    el._parallaxFactor = parseFloat(binding.value) || 0
    items.add(el)
    tick()
  },
  unmounted(el) {
    items.delete(el)
  },
}
