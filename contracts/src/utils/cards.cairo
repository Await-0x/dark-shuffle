mod card_utils {
    use darkshuffle::models::battle::{Card};
    use darkshuffle::constants::{CardTypes, CardTags};

    fn get_card(id: u16) -> Card {
        if id == 1 {
            return Card {
                card_id: 1,
                name: 'Wild Dog',
                card_type: CardTypes::CREATURE,
                card_tag: CardTags::SCAVENGER,
                cost: 1,
                attack: 1,
                health: 1,
            };
        }

        else if id == 2 {
            return Card {
                card_id: 2,
                name: 'Jackal',
                card_type: CardTypes::CREATURE,
                card_tag: CardTags::SCAVENGER,
                cost: 1,
                attack: 5,
                health: 5,
            };
        }
        
        else if id == 3 {
            return Card {
                card_id: 3,
                name: 'Coyote',
                card_type: CardTypes::CREATURE,
                card_tag: CardTags::SCAVENGER,
                cost: 5,
                attack: 5,
                health: 5,
            };
        }
        
        else if id == 4 {
            return Card {
                card_id: 4,
                name: 'Kite',
                card_type: CardTypes::CREATURE,
                card_tag: CardTags::SCAVENGER,
                cost: 3,
                attack: 3,
                health: 3,
            };
        }
        
        else if id == 5 {
            return Card {
                card_id: 5,
                name: 'Rat',
                card_type: CardTypes::CREATURE,
                card_tag: CardTags::SCAVENGER,
                cost: 4,
                attack: 4,
                health: 4,
            };
        }
        
        else if id == 6 {
            return Card {
                card_id: 6,
                name: 'Magpie',
                card_type: CardTypes::CREATURE,
                card_tag: CardTags::SCAVENGER,
                cost: 2,
                attack: 6,
                health: 6,
            };
        }
        
        else if id == 7 {
            return Card {
                card_id: 7,
                name: 'Seagull',
                card_type: CardTypes::CREATURE,
                card_tag: CardTags::SCAVENGER,
                cost: 3,
                attack: 7,
                health: 7,
            };
        }
        
        else if id == 8 {
            return Card {
                card_id: 8,
                name: 'Condor',
                card_type: CardTypes::CREATURE,
                card_tag: CardTags::SCAVENGER,
                cost: 1,
                attack: 3,
                health: 3,
            };
        }
        
        else if id == 9 {
            return Card {
                card_id: 9,
                name: 'Fox',
                card_type: CardTypes::CREATURE,
                card_tag: CardTags::SCAVENGER,
                cost: 2,
                attack: 4,
                health: 4,
            };
        }
        
        else if id == 10 {
            return Card {
                card_id: 10,
                name: 'Opossum',
                card_type: CardTypes::CREATURE,
                card_tag: CardTags::SCAVENGER,
                cost: 3,
                attack: 5,
                health: 5,
            };
        }
        
        else if id == 11 {
            return Card {
                card_id: 11,
                name: 'Tasmanian Devil',
                card_type: CardTypes::CREATURE,
                card_tag: CardTags::SCAVENGER,
                cost: 4,
                attack: 6,
                health: 6,
            };
        }
        
        else if id == 12 {
            return Card {
                card_id: 12,
                name: 'Bald Eagle',
                card_type: CardTypes::CREATURE,
                card_tag: CardTags::SCAVENGER,
                cost: 5,
                attack: 7,
                health: 7,
            };
        }
        
        else if id == 13 {
            return Card {
                card_id: 13,
                name: 'King Vulture',
                card_type: CardTypes::CREATURE,
                card_tag: CardTags::SCAVENGER,
                cost: 1,
                attack: 4,
                health: 2,
            };
        }
        
        else if id == 14 {
            return Card {
                card_id: 14,
                name: 'Griffon',
                card_type: CardTypes::CREATURE,
                card_tag: CardTags::SCAVENGER,
                cost: 2,
                attack: 3,
                health: 5,
            };
        }
        
        else if id == 15 {
            return Card   {
                card_id: 15,
                name: 'Binturong',
                card_type: CardTypes::CREATURE,
                card_tag: CardTags::SCAVENGER,
                cost: 3,
                attack: 7,
                health: 3,
            };
        }
        
        else if id == 16 {
            return Card {
                card_id: 16,
                name: 'Skunk',
                card_type: CardTypes::CREATURE,
                card_tag: CardTags::SCAVENGER,
                cost: 4,
                attack: 3,
                health: 9,
            };
        }
        
        else if id == 17 {
            return Card {
                card_id: 17,
                name: 'Caterpillar',
                card_type: CardTypes::CREATURE,
                card_tag: CardTags::SCAVENGER,
                cost: 1,
                attack: 2,
                health: 4,
            };
        }
        
        else if id == 18 {
            return Card {
                card_id: 18,
                name: 'Grub Worm',
                card_type: CardTypes::CREATURE,
                card_tag: CardTags::SCAVENGER,
                cost: 5,
                attack: 8,
                health: 3,
            };
        }
        
        else if id == 19 {
            return Card {
                card_id: 19,
                name: 'Beetle',
                card_type: CardTypes::CREATURE,
                card_tag: CardTags::SCAVENGER,
                cost: 6,
                attack: 8,
                health: 7,
            };
        }
        
        else if id == 20 {
            return Card {
                card_id: 20,
                name: 'Weasel',
                card_type: CardTypes::CREATURE,
                card_tag: CardTags::SCAVENGER,
                cost: 7,
                attack: 10,
                health: 7,
            };
        }
        
        else if id == 21 {
            return Card {
                card_id: 21,
                name: 'Impling',
                card_type: CardTypes::CREATURE,
                card_tag: CardTags::DEMON,
                cost: 1,
                attack: 2,
                health: 1,
            };
        }
        
        else if id == 22 {
            return Card {
                card_id: 22,
                name: 'Ghoul Ravager',
                card_type: CardTypes::CREATURE,
                card_tag: CardTags::DEMON,
                cost: 2,
                attack: 2,
                health: 2,
            };
        }
        
        else if id == 23 {
            return Card {
                card_id: 23,
                name: 'Fiery Demon',
                card_type: CardTypes::CREATURE,
                card_tag: CardTags::DEMON,
                cost: 3,
                attack: 4,
                health: 2,
            };
        }
        
        else if id == 24 {
            return Card {
                card_id: 24,
                name: 'Grim Marauder',
                card_type: CardTypes::CREATURE,
                card_tag: CardTags::DEMON,
                cost: 4,
                attack: 4,
                health: 4,
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