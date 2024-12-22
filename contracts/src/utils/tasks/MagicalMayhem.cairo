use darkshuffle::utils::tasks::interface::TaskTrait;

impl MagicalMayhem of TaskTrait {
    #[inline]
    fn identifier() -> felt252 {
        'MAGICAL_MAYHEM'
    }

    #[inline]
    fn description(count: u32) -> ByteArray {
        format!("Defeat {} magical enemies", count)
    }
}
