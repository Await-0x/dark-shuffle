use darkshuffle::utils::tasks::interface::TaskTrait;

impl Heroic of TaskTrait {
    #[inline]
    fn identifier() -> felt252 {
        'HEROIC'
    }

    #[inline]
    fn description(count: u32) -> ByteArray {
        "Defeat an enemy with more health than you started"
    }
}
