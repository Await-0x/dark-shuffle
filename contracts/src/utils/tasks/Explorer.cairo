use darkshuffle::utils::tasks::interface::TaskTrait;

impl Explorer of TaskTrait {
    #[inline]
    fn identifier() -> felt252 {
        'EXPLORER'
    }

    #[inline]
    fn description(count: u32) -> ByteArray {
        format!("Complete {} maps", count)
    }
}
