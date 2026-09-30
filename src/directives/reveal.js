export const reveal = {
  mounted(el) {
    if (!('IntersectionObserver' in window)) {
      el.style.opacity = 1
      el.style.transform = 'none'
      return
    }
    const r = el.getBoundingClientRect()
    if (r.top < window.innerHeight) {
      el.style.opacity = 1
      el.style.transform = 'none'
      return
    }
    el.style.opacity = 0
    el.style.transform = 'translateY(28px)'
    el.style.transition =
      'opacity .9s cubic-bezier(.2,.7,.2,1), transform .9s cubic-bezier(.2,.7,.2,1)'
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            el.style.opacity = 1
            el.style.transform = 'none'
            io.unobserve(el)
          }
        })
      },
      { threshold: 0.12 },
    )
    io.observe(el)
    el._io = io
  },
  unmounted(el) {
    el._io?.disconnect()
  },
}
