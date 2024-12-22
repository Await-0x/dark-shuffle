use darkshuffle::utils::tasks::interface::TaskTrait;

impl Seasoned of TaskTrait {
    #[inline]
    fn identifier() -> felt252 {
        'SEASONED'
    }

    #[inline]
    fn description(count: u32) -> ByteArray {
        format!("Play {} games", count)
    }
}
