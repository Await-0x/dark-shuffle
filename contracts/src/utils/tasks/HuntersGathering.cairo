use darkshuffle::utils::tasks::interface::TaskTrait;

impl HuntersGathering of TaskTrait {
    #[inline]
    fn identifier() -> felt252 {
        'HUNTERS_GATHERING'
    }

    #[inline]
    fn description(count: u32) -> ByteArray {
        format!("Play {} hunter creatures", count)
    }
}
