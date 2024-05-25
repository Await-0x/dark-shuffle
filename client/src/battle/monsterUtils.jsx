import minotaur from '../assets/images/monsters/minotaur.png'
import troll from "../assets/images/monsters/troll.png"
import bigfoot from "../assets/images/monsters/bigfoot.png"
import chimera from "../assets/images/monsters/chimera.png"
import kappa from "../assets/images/monsters/kappa.png"
import spider from "../assets/images/monsters/spider.png"
import lich from "../assets/images/monsters/lich.png"

export const MONSTER_LIST = [
  {
    id: 401,
    monsterId: 401,
    image: <img alt='' src={minotaur} height={'100%'} />,
    abilities: [],
    attack: 1,
    health: 60,
  },
  {
    id: 402,
    monsterId: 402,
    image: <img alt='' src={troll} height={'100%'} />,
    abilities: [],
    attack: 4,
    health: 60,
  },
  {
    id: 403,
    monsterId: 403,
    image: <img alt='' src={bigfoot} height={'100%'} />,
    abilities: [],
    attack: 4,
    health: 60,
  },
  {
    id: 404,
    monsterId: 404,
    image: <img alt='' src={chimera} height={'100%'} />,
    abilities: [],
    attack: 4,
    health: 60,
  },
  {
    id: 405,
    monsterId: 405,
    image: <img alt='' src={kappa} height={'100%'} />,
    abilities: [],
    attack: 4,
    health: 60,
  },
  {
    id: 406,
    monsterId: 406,
    image: <img alt='' src={spider} height={'100%'} />,
    abilities: [],
    attack: 4,
    health: 60,
  },
  {
    id: 407,
    monsterId: 407,
    image: <img alt='' src={lich} height={'100%'} />,
    abilities: [],
    attack: 4,
    health: 60,
  },
]

export const fecthMonster = (battlesWon) => {
  let id = battlesWon % 7

  let bonus_attack = 0;
  let bonus_health = 0;

  bonus_attack += Math.floor(battlesWon / 7) * 2
  bonus_health += Math.floor(battlesWon / 7) * 20

  let monster = { ...MONSTER_LIST[id] }

  monster.attack += bonus_attack;
  monster.health += bonus_health

  return monster
}

export const fetchZoneName = (battlesWon) => {
  if (battlesWon < 7) {
    return 'Twilight Zone'
  }

  if (battlesWon < 14) {
    return 'Dark Zone'
  }

  return 'The Abyss'
}

export const fetchIntroduction = (battlesWon) => {
  switch (battlesWon % 7) {
    case 0:
      return {
        description: `
          As you navigate the twisting passages of the cave, the ominous silence is shattered by a guttural snarl.
          Before you can react, a massive creature emerges from the shadows, its eyes ablaze with predatory hunger.
          It stands, hulking and formidable, with sharp spines lining its back and lethal claws ready to strike.
        `,
        image: <img alt='' src={minotaur} height={'50%'} />
      }
    case 1:
      return {
        description: `
          In the flickering shadows of the cavern, a hulking figure lumbers into your path.
          A troll, grotesque and towering, blocks your advance with its immense bulk.
          Its skin is a patchwork of warts and scars, a testament to countless battles.
          Small, beady eyes peer out from under a heavy brow, sizing you up with a mix of curiosity and malice.
          The air grows thick with the stench of damp moss and foul breath as it prepares to charge.
          `,
        image: <img alt='' src={troll} height={'50%'} />
      }
    case 2:
      return {
        description: `
          As you carefully tread through the dense underbrush of the cave's more verdant section, a sudden rustling stops you in your tracks.
          Emerging from the shadows, a towering Bigfoot-like creature blocks your path.
          Its muscular frame looms large, eyes glinting with intelligence and strength.
          With a deep, resonant growl, it challenges you, its presence demanding a battle of both power and wit.
          `,
        image: <img alt='' src={bigfoot} height={'50%'} />
      }
    case 3:
      return {
        description: `
          In the dim light, a fearsome shape materializes, a mighty beast of legend.
          With the head of a roaring lion, the body of a powerful goat, and a serpent for a tail, its presence is overwhelming.
          Each breath it takes sparks fear, its mixed growl, bleat, and hiss echoing off the cave walls.
          Flames flicker at the corners of the lion's mouth, promising a fiery demise to those who dare challenge it.
          `,
        image: <img alt='' src={chimera} height={'50%'} />
      }
    case 4:
      return {
        description: `
          In the cavern's quiet, a small figure seated with crossed legs near a tranquil pool captures your attention.
          Its scaly skin and the mysterious, water-filled depression atop its head hint at deep, mystical powers.
          Despite its peaceful pose, a palpable, ominous aura surrounds it. Those deep, watchful eyes challenge you,
          promising a test of wit and spirit beyond mere physical confrontation.
          `,
        image: <img alt='' src={kappa} height={'50%'} />
      }
    case 5:
      return {
        description: `
          In the shadowy recesses of the cave, your path is suddenly barred by a giant spider.
          Its massive, hairy legs stretch out, encircling you, while its multiple, gleaming eyes fixate with predatory focus.
          The air thickens with the scent of ancient webbing and prey long captured. Poised above, it prepares to strike, promising a swift, entangling battle.
          `,
        image: <img alt='' src={spider} height={'50%'} />
      }
    case 6:
      return {
        description: `
          In the chilling silence of the cave, you encounter a Lich, its skeletal form crouched amidst ancient debris, draped in the remnants of its once grand attire.
          Sinister light emanates from its hollow eye sockets, illuminating the surroundings with an otherworldly glow.
          Dark magic swirls around its outstretched fingers, ready to unleash spells of formidable power.
          `,
        image: <img alt='' src={lich} height={'50%'} />
      }
    default:
      return {}
  }
}