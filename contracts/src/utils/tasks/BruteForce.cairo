use darkshuffle::utils::tasks::interface::TaskTrait;

impl BruteForce of TaskTrait {
    #[inline]
    fn identifier() -> felt252 {
        'BRUTE_FORCE'
    }

    #[inline]
    fn description(count: u32) -> ByteArray {
        format!("Defeat {} brute enemies", count)
    }
}
