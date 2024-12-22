use darkshuffle::utils::tasks::interface::TaskTrait;

impl Survivor of TaskTrait {
    #[inline]
    fn identifier() -> felt252 {
        'SURVIVOR'
    }

    #[inline]
    fn description(count: u32) -> ByteArray {
        "Defeat an enemy with 1 health remaining"
    }
}
