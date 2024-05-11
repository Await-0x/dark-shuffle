export const fadeVariant = {
  initial: {
    opacity: 0
  },
  enter: {
    opacity: 1,
    transition: { duration: 0.5 }
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.5 }
  }
};

export const fadeChildrenContainer = {
  hidden: { opacity: 1, scale: 0 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.2
    }
  }
}

export const fadeChildrenItem = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1
  }
}