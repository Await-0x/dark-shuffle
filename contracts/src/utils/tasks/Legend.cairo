use darkshuffle::utils::tasks::interface::TaskTrait;

impl Legend of TaskTrait {
    #[inline]
    fn identifier() -> felt252 {
        'LEGEND'
    }

    #[inline]
    fn description(count: u32) -> ByteArray {
        format!("Finish a season as top {}", count)
    }
}
