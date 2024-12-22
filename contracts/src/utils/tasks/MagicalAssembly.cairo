use darkshuffle::utils::tasks::interface::TaskTrait;

impl MagicalAssembly of TaskTrait {
    #[inline]
    fn identifier() -> felt252 {
        'MAGICAL_ASSEMBLY'
    }

    #[inline]
    fn description(count: u32) -> ByteArray {
        format!("Play {} magical creatures", count)
    }
}
