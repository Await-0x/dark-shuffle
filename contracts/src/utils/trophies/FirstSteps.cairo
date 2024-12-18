use darkshuffle::utils::trophies::interface::{TrophyTrait, BushidoTask, Task, TaskTrait};

impl Battlelord of TrophyTrait {
    #[inline]
    fn identifier(level: u8) -> felt252 {
        match level {
            0 => 'FIRST_STEPS_I',
            1 => 'FIRST_STEPS_II',
            2 => 'FIRST_STEPS_III',
            _ => '',
        }
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
        match level {
            0 => 10,
            1 => 20,
            2 => 30,
            _ => 0,
        }
    }

    #[inline]
    fn group() -> felt252 {
        'First Steps'
    }

    #[inline]
    fn icon(level: u8) -> felt252 {
        'fa-helmet-battle'
    }

    #[inline]
    fn title(level: u8) -> felt252 {
        match level {
            0 => 'First Steps I',
            1 => 'First Steps II',
            2 => 'First Steps III',
            _ => '',
        }
    }

    #[inline]
    fn description(level: u8) -> ByteArray {
        "Every journey begins with a single step"
    }

    #[inline]
    fn tasks(level: u8) -> Span<BushidoTask> {
        let count: u32 = match level {
            0 => 1,
            1 => 5,
            2 => 10,
            _ => 0,
        };
        Task::FirstSteps.tasks(count)
    }
}
