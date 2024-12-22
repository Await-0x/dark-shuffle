use darkshuffle::utils::tasks::interface::TaskTrait;

impl BigHit of TaskTrait {
    #[inline]
    fn identifier() -> felt252 {
        'BIG_HIT'
    }

    #[inline]
    fn description(count: u32) -> ByteArray {
        "Deal 25 damage in a single turn"
    }
}
