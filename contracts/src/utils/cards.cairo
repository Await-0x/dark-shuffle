mod card_utils {
    use darkshuffle::models::battle::{Card};
    use darkshuffle::constants::{CardTypes, CardTags};

    fn get_card(id: u16, level: u16) -> Card {
        if id == 1 {
            return Card {
                card_id: 1,
                name: 'Wisdom Bringer',
                card_type: CardTypes::CREATURE,
                card_tag: CardTags::ESCALATING,
                cost: 4,
                attack: 3,
                health: 6,
                level
            };
        }

        else if id == 2 {
            return Card {
                card_id: 2,
                name: 'Faith Guardian',
                card_type: CardTypes::CREATURE,
                card_tag: CardTags::ESCALATING,
                cost: 4,
                attack: 5,
                health: 2,
                level
            };
        }
        
        else if id == 3 {
            return Card {
                card_id: 3,
                name: 'Solace Bringer',
                card_type: CardTypes::CREATURE,
                card_tag: CardTags::ESCALATING,
                cost: 5,
                attack: 4,
                health: 10,
                level
            };
        }
        
        else if id == 4 {
            return Card {
                card_id: 4,
                name: 'Eden Priest',
                card_type: CardTypes::CREATURE,
                card_tag: CardTags::ESCALATING,
                cost: 3,
                attack: 2,
                health: 8,
                level
            };
        }
        
        else if id == 5 {
            return Card {
                card_id: 5,
                name: 'Wild Dog',
                card_type: CardTypes::CREATURE,
                card_tag: CardTags::ESCALATING,
                cost: 1,
                attack: 5,
                health: 2,
                level
            };
        }
        
        else if id == 6 {
            return Card {
                card_id: 6,
                name: 'Coyote',
                card_type: CardTypes::CREATURE,
                card_tag: CardTags::ESCALATING,
                cost: 2,
                attack: 5,
                health: 5,
                level
            };
        }
        
        else if id == 7 {
            return Card {
                card_id: 7,
                name: 'Fiery Demon',
                card_type: CardTypes::CREATURE,
                card_tag: CardTags::ESCALATING,
                cost: 6,
                attack: 9,
                health: 6,
                level
            };
        }
        
        else if id == 8 {
            return Card {
                card_id: 8,
                name: 'Beetle',
                card_type: CardTypes::CREATURE,
                card_tag: CardTags::ESCALATING,
                cost: 4,
                attack: 6,
                health: 6,
                level
            };
        }
        
        else if id == 9 {
            return Card {
                card_id: 9,
                name: 'Zephyr',
                card_type: CardTypes::CREATURE,
                card_tag: CardTags::ESCALATING,
                cost: 4,
                attack: 5,
                health: 8,
                level
            };
        }
        
        else if id == 10 {
            return Card {
                card_id: 10,
                name: 'Fireball',
                card_type: CardTypes::SPELL,
                card_tag: CardTags::ESCALATING,
                cost: 1,
                attack: 0,
                health: 0,
                level
            };
        }
        
        else if id == 11 {
            return Card {
                card_id: 11,
                name: 'Lightning Strike',
                card_type: CardTypes::SPELL,
                card_tag: CardTags::ESCALATING,
                cost: 3,
                attack: 0,
                health: 0,
                level
            };
        }
        
        else if id == 12 {
            return Card {
                card_id: 12,
                name: 'First Aid',
                card_type: CardTypes::SPELL,
                card_tag: CardTags::ESCALATING,
                cost: 3,
                attack: 0,
                health: 0,
                level
            };
        }
        
        else if id == 13 {
            return Card {
                card_id: 13,
                name: 'Grace Warden',
                card_type: CardTypes::CREATURE,
                card_tag: CardTags::SCALABLE,
                cost: 2,
                attack: 3,
                health: 7,
                level
            };
        }
        
        else if id == 14 {
            return Card {
                card_id: 14,
                name: 'Blessing Caster',
                card_type: CardTypes::CREATURE,
                card_tag: CardTags::SCALABLE,
                cost: 3,
                attack: 5,
                health: 4,
                level
            };
        }
        
        else if id == 15 {
            return Card   {
                card_id: 15,
                name: 'Gospel Scribe',
                card_type: CardTypes::CREATURE,
                card_tag: CardTags::SCALABLE,
                cost: 5,
                attack: 7,
                health: 5,
                level
            };
        }
        
        else if id == 16 {
            return Card {
                card_id: 16,
                name: 'Chant Monk',
                card_type: CardTypes::CREATURE,
                card_tag: CardTags::SCALABLE,
                cost: 4,
                attack: 0,
                health: 0,
                level
            };
        }
        
        else if id == 17 {
            return Card {
                card_id: 17,
                name: 'Grim Marauder',
                card_type: CardTypes::CREATURE,
                card_tag: CardTags::SCALABLE,
                cost: 2,
                attack: 5,
                health: 8,
                level
            };
        }
        
        else if id == 18 {
            return Card {
                card_id: 18,
                name: 'Tasmanian Devil',
                card_type: CardTypes::CREATURE,
                card_tag: CardTags::SCALABLE,
                cost: 3,
                attack: 7,
                health: 10,
                level
            };
        }
        
        else if id == 19 {
            return Card {
                card_id: 19,
                name: 'Jackal',
                card_type: CardTypes::CREATURE,
                card_tag: CardTags::SCALABLE,
                cost: 4,
                attack: 14,
                health: 2,
                level
            };
        }
        
        else if id == 20 {
            return Card {
                card_id: 20,
                name: 'Binturong',
                card_type: CardTypes::CREATURE,
                card_tag: CardTags::SCALABLE,
                cost: 5,
                attack: 9,
                health: 18,
                level
            };
        }
        
        else if id == 21 {
            return Card {
                card_id: 21,
                name: 'Virtue Curate',
                card_type: CardTypes::CREATURE,
                card_tag: CardTags::RENEWABLE,
                cost: 5,
                attack: 2,
                health: 2,
                level
            };
        }
        
        else if id == 22 {
            return Card {
                card_id: 22,
                name: 'Mercy Giver',
                card_type: CardTypes::CREATURE,
                card_tag: CardTags::RENEWABLE,
                cost: 6,
                attack: 4,
                health: 4,
                level
            };
        }
        
        else if id == 23 {
            return Card {
                card_id: 23,
                name: 'Celestial Minister',
                card_type: CardTypes::CREATURE,
                card_tag: CardTags::RENEWABLE,
                cost: 7,
                attack: 7,
                health: 7,
                level
            };
        }
        
        else if id == 24 {
            return Card {
                card_id: 24,
                name: 'Peace Keeper',
                card_type: CardTypes::CREATURE,
                card_tag: CardTags::RENEWABLE,
                cost: 4,
                attack: 6,
                health: 6,
                level
            };
        }

        else if id == 25 {
            return Card {
                card_id: 25,
                name: 'Rat',
                card_type: CardTypes::CREATURE,
                card_tag: CardTags::RENEWABLE,
                cost: 5,
                attack: 13,
                health: 13,
                level
            };
        }

        else if id == 26 {
            return Card {
                card_id: 26,
                name: 'Bald Eagle',
                card_type: CardTypes::CREATURE,
                card_tag: CardTags::RENEWABLE,
                cost: 5,
                attack: 4,
                health: 7,
                level
            };
        }

        else if id == 27 {
            return Card {
                card_id: 27,
                name: 'Devourer',
                card_type: CardTypes::CREATURE,
                card_tag: CardTags::RENEWABLE,
                cost: 6,
                attack: 15,
                health: 15,
                level
            };
        }

        else if id == 28 {
            return Card {
                card_id: 28,
                name: 'Rage Infernal',
                card_type: CardTypes::CREATURE,
                card_tag: CardTags::RENEWABLE,
                cost: 6,
                attack: 10,
                health: 9,
                level
            };
        }

        else if id == 29 {
            return Card {
                card_id: 29,
                name: 'Jinx Weaver',
                card_type: CardTypes::CREATURE,
                card_tag: CardTags::RENEWABLE,
                cost: 6,
                attack: 9,
                health: 12,
                level
            };
        }

        else if id == 30 {
            return Card {
                card_id: 30,
                name: 'Blessed Barrier',
                card_type: CardTypes::SPELL,
                card_tag: CardTags::RENEWABLE,
                cost: 6,
                attack: 0,
                health: 0,
                level
            };
        }

        else if id == 31 {
            return Card {
                card_id: 31,
                name: 'Barricade',
                card_type: CardTypes::SPELL,
                card_tag: CardTags::RENEWABLE,
                cost: 4,
                attack: 0,
                health: 0,
                level
            };
        }

        else if id == 32 {
            return Card {
                card_id: 32,
                name: 'Natures Wrath',
                card_type: CardTypes::SPELL,
                card_tag: CardTags::RENEWABLE,
                cost: 5,
                attack: 0,
                health: 0,
                level
            };
        }

        else if id == 33 {
            return Card {
                card_id: 33,
                name: 'Spark',
                card_type: CardTypes::SPELL,
                card_tag: CardTags::RENEWABLE,
                cost: 2,
                attack: 0,
                health: 0,
                level
            };
        }

        else if id == 34 {
            return Card {
                card_id: 34,
                name: 'Divine Intervention',
                card_type: CardTypes::SPELL,
                card_tag: CardTags::RENEWABLE,
                cost: 4,
                attack: 0,
                health: 0,
                level
            };
        }

        else if id == 35 {
            return Card {
                card_id: 35,
                name: 'Energy Transfer',
                card_type: CardTypes::SPELL,
                card_tag: CardTags::NONE,
                cost: 1,
                attack: 0,
                health: 0,
                level
            };
        }

        else if id == 36 {
            return Card {
                card_id: 36,
                name: 'Greater Heal',
                card_type: CardTypes::SPELL,
                card_tag: CardTags::UNSTABLE,
                cost: 1,
                attack: 0,
                health: 0,
                level
            };
        }

        else if id == 37 {
            return Card {
                card_id: 37,
                name: 'Power Injection',
                card_type: CardTypes::SPELL,
                card_tag: CardTags::UNSTABLE,
                cost: 1,
                attack: 0,
                health: 0,
                level
            };
        }

        else if id == 38 {
            return Card {
                card_id: 38,
                name: 'Shifting Aegis',
                card_type: CardTypes::SPELL,
                card_tag: CardTags::UNSTABLE,
                cost: 1,
                attack: 0,
                health: 0,
                level
            };
        }

        else if id == 39 {
            return Card {
                card_id: 39,
                name: 'Chaotic Blast',
                card_type: CardTypes::SPELL,
                card_tag: CardTags::UNSTABLE,
                cost: 1,
                attack: 0,
                health: 0,
                level
            };
        }

        else if id == 40 {
            return Card {
                card_id: 40,
                name: 'Flickering Sanctuary',
                card_type: CardTypes::SPELL,
                card_tag: CardTags::UNSTABLE,
                cost: 1,
                attack: 0,
                health: 0,
                level
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
            level: 0
        }
    }
}