import type { Directive } from 'vue'

const reveal: Directive<HTMLElement> = {
  mounted(el) {
    el.classList.add('reveal')

    if (typeof IntersectionObserver === 'undefined') {
      el.classList.add('reveal-visible')
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.classList.add('reveal-visible')
            observer.unobserve(el)
          }
        })
      },
      { threshold: 0.2 },
    )

    observer.observe(el)
  },
}

export default reveal
