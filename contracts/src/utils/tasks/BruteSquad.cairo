use darkshuffle::utils::tasks::interface::TaskTrait;

impl BruteSquad of TaskTrait {
    #[inline]
    fn identifier() -> felt252 {
        'BRUTE_SQUAD'
    }

    #[inline]
    fn description(count: u32) -> ByteArray {
        format!("Play {} brute creatures", count)
    }
}
