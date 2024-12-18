use s0_eternum::utils::trophies::interface::{TrophyTrait, BushidoTask, Task, TaskTrait};

impl Squire of TrophyTrait {
    #[inline]
    fn identifier(level: u8) -> felt252 {
        'SURVIVOR'
    }

    #[inline]
    fn hidden(level: u8) -> bool {
        false
    }

    #[inline]
    fn index(level: u8) -> u8 {
        level
    }

    #[inline]
    fn points(level: u8) -> u16 {
        30
    }

    #[inline]
    fn group() -> felt252 {
        'Survivor'
    }

    #[inline]
    fn icon(level: u8) -> felt252 {
        'fa-seedling'
    }

    #[inline]
    fn title(level: u8) -> felt252 {
        'Survivor'
    }

    #[inline]
    fn description(level: u8) -> ByteArray {
        "There is only one thing we say to death... not today"
    }

    #[inline]
    fn tasks(level: u8) -> Span<BushidoTask> {
        let count: u32 = 1;
        Task::Survivor.tasks(count)
    }
}
