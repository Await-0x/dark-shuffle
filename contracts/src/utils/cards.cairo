mod card_utils {
    use darkshuffle::models::battle::{Card};
    use darkshuffle::constants::{CardTypes, CardTags};

    fn get_card(id: u16) -> Card {
        if id == 1 {
            return Card {
                card_id: 1,
                name: 'Wild Dog',
                card_type: CardTypes::CREATURE,
                card_tag: CardTypes::ESCALATING,
                cost: 3,
                attack: 3,
                health: 6,
            };
        }

        else if id == 2 {
            return Card {
                card_id: 2,
                name: 'Wisdom Bringer',
                card_type: CardTypes::CREATURE,
                card_tag: CardTypes::ESCALATING,
                cost: 4,
                attack: 5,
                health: 2,
            };
        }
        
        else if id == 3 {
            return Card {
                card_id: 3,
                name: 'Fiery Demon',
                card_type: CardTypes::CREATURE,
                card_tag: CardTypes::ESCALATING,
                cost: 5,
                attack: 4,
                health: 10,
            };
        }
        
        else if id == 4 {
            return Card {
                card_id: 4,
                name: 'Zarthos',
                card_type: CardTypes::CREATURE,
                card_tag: CardTypes::ESCALATING,
                cost: 3,
                attack: 2,
                health: 8,
            };
        }
        
        else if id == 5 {
            return Card {
                card_id: 5,
                name: 'Faith Guardian',
                card_type: CardTypes::CREATURE,
                card_tag: CardTypes::ESCALATING,
                cost: 1,
                attack: 5,
                health: 2,
            };
        }
        
        else if id == 6 {
            return Card {
                card_id: 6,
                name: 'Grim Marauder',
                card_type: CardTypes::CREATURE,
                card_tag: CardTypes::ESCALATING,
                cost: 2,
                attack: 5,
                health: 5,
            };
        }
        
        else if id == 7 {
            return Card {
                card_id: 7,
                name: 'Blessing Caster',
                card_type: CardTypes::CREATURE,
                card_tag: CardTypes::ESCALATING,
                cost: 6,
                attack: 9,
                health: 6,
            };
        }
        
        else if id == 8 {
            return Card {
                card_id: 8,
                name: 'Tasmanian Devil',
                card_type: CardTypes::CREATURE,
                card_tag: CardTypes::ESCALATING,
                cost: 4,
                attack: 6,
                health: 6,
            };
        }
        
        else if id == 9 {
            return Card {
                card_id: 9,
                name: 'Jackal',
                card_type: CardTypes::CREATURE,
                card_tag: CardTypes::ESCALATING,
                cost: 4,
                attack: 5,
                health: 8,
            };
        }
        
        else if id == 10 {
            return Card {
                card_id: 10,
                name: 'Ghoul Ravager',
                card_type: CardTypes::SPELL,
                card_tag: CardTypes::ESCALATING,
                cost: 1,
                attack: 0,
                health: 0,
            };
        }
        
        else if id == 11 {
            return Card {
                card_id: 11,
                name: 'Gospel Scribe',
                card_type: CardTypes::SPELL,
                card_tag: CardTypes::ESCALATING,
                cost: 3,
                attack: 0,
                health: 0,
            };
        }
        
        else if id == 12 {
            return Card {
                card_id: 12,
                name: 'Eden Priest',
                card_type: CardTypes::SPELL,
                card_tag: CardTypes::ESCALATING,
                cost: 1,
                attack: 0,
                health: 0,
            };
        }
        
        else if id == 13 {
            return Card {
                card_id: 13,
                name: 'Coyote',
                card_type: CardTypes::CREATURE,
                card_tag: CardTypes::SCALABLE,
                cost: 2,
                attack: 3,
                health: 7,
            };
        }
        
        else if id == 14 {
            return Card {
                card_id: 14,
                name: 'Virtue Curate',
                card_type: CardTypes::CREATURE,
                card_tag: CardTypes::SCALABLE,
                cost: 3,
                attack: 5,
                health: 4,
            };
        }
        
        else if id == 15 {
            return Card   {
                card_id: 15,
                name: 'Solace Bringer',
                card_type: CardTypes::CREATURE,
                card_tag: CardTypes::SCALABLE,
                cost: 5,
                attack: 7,
                health: 5,
            };
        }
        
        else if id == 16 {
            return Card {
                card_id: 16,
                name: 'Zephyr',
                card_type: CardTypes::CREATURE,
                card_tag: CardTypes::SCALABLE,
                cost: 4,
                attack: 0,
                health: 0,
            };
        }
        
        else if id == 17 {
            return Card {
                card_id: 17,
                name: 'Divine Speaker',
                card_type: CardTypes::CREATURE,
                card_tag: CardTypes::SCALABLE,
                cost: 2,
                attack: 5,
                health: 8,
            };
        }
        
        else if id == 18 {
            return Card {
                card_id: 18,
                name: 'Fireball',
                card_type: CardTypes::CREATURE,
                card_tag: CardTypes::SCALABLE,
                cost: 3,
                attack: 7,
                health: 10,
            };
        }
        
        else if id == 19 {
            return Card {
                card_id: 19,
                name: 'Flash Heal',
                card_type: CardTypes::CREATURE,
                card_tag: CardTypes::SCALABLE,
                cost: 4,
                attack: 14,
                health: 2,
            };
        }
        
        else if id == 20 {
            return Card {
                card_id: 20,
                name: 'Greater Heal',
                card_type: CardTypes::CREATURE,
                card_tag: CardTypes::SCALABLE,
                cost: 5,
                attack: 9,
                health: 18,
            };
        }
        
        else if id == 21 {
            return Card {
                card_id: 21,
                name: 'Lava Wave',
                card_type: CardTypes::CREATURE,
                card_tag: CardTypes::RENEWABLE,
                cost: 5,
                attack: 2,
                health: 2,
            };
        }
        
        else if id == 22 {
            return Card {
                card_id: 22,
                name: 'Temporal Shift',
                card_type: CardTypes::CREATURE,
                card_tag: CardTypes::RENEWABLE,
                cost: 6,
                attack: 1,
                health: 4,
            };
        }
        
        else if id == 23 {
            return Card {
                card_id: 23,
                name: 'Power Injection',
                card_type: CardTypes::CREATURE,
                card_tag: CardTypes::RENEWABLE,
                cost: 7,
                attack: 2,
                health: 2,
            };
        }
        
        else if id == 24 {
            return Card {
                card_id: 24,
                name: 'Peace Giver',
                card_type: CardTypes::CREATURE,
                card_tag: CardTypes::RENEWABLE,
                cost: 4,
                attack: 6,
                health: 6,
            };
        }

        else if id == 25 {
            return Card {
                card_id: 25,
                name: 'Blessed Barrier',
                card_type: CardTypes::CREATURE,
                card_tag: CardTypes::RENEWABLE,
                cost: 5,
                attack: 13,
                health: 13,
            };
        }

        else if id == 26 {
            return Card {
                card_id: 26,
                name: 'Blessed Barrier',
                card_type: CardTypes::CREATURE,
                card_tag: CardTypes::RENEWABLE,
                cost: 5,
                attack: 4,
                health: 7,
            };
        }

        else if id == 27 {
            return Card {
                card_id: 27,
                name: 'Blessed Barrier',
                card_type: CardTypes::CREATURE,
                card_tag: CardTypes::RENEWABLE,
                cost: 6,
                attack: 15,
                health: 15,
            };
        }

        else if id == 28 {
            return Card {
                card_id: 28,
                name: 'Blessed Barrier',
                card_type: CardTypes::CREATURE,
                card_tag: CardTypes::RENEWABLE,
                cost: 6,
                attack: 10,
                health: 9,
            };
        }

        else if id == 29 {
            return Card {
                card_id: 29,
                name: 'Blessed Barrier',
                card_type: CardTypes::CREATURE,
                card_tag: CardTypes::RENEWABLE,
                cost: 6,
                attack: 9,
                health: 12,
            };
        }

        else if id == 30 {
            return Card {
                card_id: 30,
                name: 'Blessed Barrier',
                card_type: CardTypes::SPELL,
                card_tag: CardTypes::RENEWABLE,
                cost: 8,
                attack: 0,
                health: 0,
            };
        }

        else if id == 31 {
            return Card {
                card_id: 31,
                name: 'Blessed Barrier',
                card_type: CardTypes::SPELL,
                card_tag: CardTypes::RENEWABLE,
                cost: 4,
                attack: 0,
                health: 0,
            };
        }

        else if id == 32 {
            return Card {
                card_id: 32,
                name: 'Blessed Barrier',
                card_type: CardTypes::SPELL,
                card_tag: CardTypes::RENEWABLE,
                cost: 5,
                attack: 0,
                health: 0,
            };
        }

        else if id == 33 {
            return Card {
                card_id: 33,
                name: 'Blessed Barrier',
                card_type: CardTypes::SPELL,
                card_tag: CardTypes::RENEWABLE,
                cost: 2,
                attack: 0,
                health: 0,
            };
        }

        else if id == 34 {
            return Card {
                card_id: 34,
                name: 'Blessed Barrier',
                card_type: CardTypes::SPELL,
                card_tag: CardTypes::RENEWABLE,
                cost: 4,
                attack: 0,
                health: 0,
            };
        }

        else if id == 35 {
            return Card {
                card_id: 35,
                name: 'Blessed Barrier',
                card_type: CardTypes::SPELL,
                card_tag: CardTypes::NONE,
                cost: 1,
                attack: 0,
                health: 0,
            };
        }

        else if id == 36 {
            return Card {
                card_id: 36,
                name: 'Blessed Barrier',
                card_type: CardTypes::SPELL,
                card_tag: CardTypes::UNSTABLE,
                cost: 1,
                attack: 0,
                health: 0,
            };
        }

        else if id == 37 {
            return Card {
                card_id: 37,
                name: 'Blessed Barrier',
                card_type: CardTypes::SPELL,
                card_tag: CardTypes::UNSTABLE,
                cost: 1,
                attack: 0,
                health: 0,
            };
        }

        else if id == 38 {
            return Card {
                card_id: 38,
                name: 'Blessed Barrier',
                card_type: CardTypes::SPELL,
                card_tag: CardTypes::UNSTABLE,
                cost: 1,
                attack: 0,
                health: 0,
            };
        }

        else if id == 39 {
            return Card {
                card_id: 39,
                name: 'Blessed Barrier',
                card_type: CardTypes::SPELL,
                card_tag: CardTypes::UNSTABLE,
                cost: 1,
                attack: 0,
                health: 0,
            };
        }

        else if id == 40 {
            return Card {
                card_id: 40,
                name: 'Blessed Barrier',
                card_type: CardTypes::SPELL,
                card_tag: CardTypes::UNSTABLE,
                cost: 1,
                attack: 0,
                health: 0,
            };
        }

        Card {
            card_id: 0,
            name: 'Unknown',
            card_type: 'None',
            card_tag: 'None',
            cost: 0,
            attack: 0,
            health: 0,
        }
    }
}