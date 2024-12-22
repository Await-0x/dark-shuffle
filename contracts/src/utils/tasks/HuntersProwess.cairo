use darkshuffle::utils::tasks::interface::TaskTrait;

impl HuntersProwess of TaskTrait {
    #[inline]
    fn identifier() -> felt252 {
        'HUNTERS_PROWESS'
    }

    #[inline]
    fn description(count: u32) -> ByteArray {
        format!("Defeat {} hunter enemies", count)
    }
}
