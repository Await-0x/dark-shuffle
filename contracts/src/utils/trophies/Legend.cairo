use darkshuffle::utils::trophies::interface::{TrophyTrait, BushidoTask, Task, TaskTrait};

impl Explorer of TrophyTrait {
    #[inline]
    fn identifier(level: u8) -> felt252 {
        match level {
            0 => 'LEGEND_I',
            1 => 'LEGEND_II',
            2 => 'LEGEND_III',
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
            0 => 50,
            1 => 100,
            2 => 150,
            _ => 0,
        }
    }

    #[inline]
    fn group() -> felt252 {
        'Legend'
    }

    #[inline]
    fn icon(level: u8) -> felt252 {
        match level {
            0 => 'fa-mountain',
            1 => 'fa-mountains',
            2 => 'fa-mountain-sun',
            _ => '',
        }
    }

    #[inline]
    fn title(level: u8) -> felt252 {
        match level {
            0 => 'Legend I',
            1 => 'Legend II',
            2 => 'Legend III',
            _ => '',
        }
    }

    #[inline]
    fn description(level: u8) -> ByteArray {
        "Your name etched in history"
    }

    #[inline]
    fn tasks(level: u8) -> Span<BushidoTask> {
        let count: u32 = match level {
            0 => 10,
            1 => 3,
            2 => 1,
            _ => 0,
        };
        Task::Explorer.tasks(count)
    }
}
