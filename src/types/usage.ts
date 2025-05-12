export interface UserLimits {
    package_name: string;
    max_daily_sessions: number;
    max_monthly_sessions: number;
    max_messages_per_session: number;
}

export interface CurrentUsage {
    daily_sessions_created: number;
    monthly_sessions_created: number;
    messages_in_current_session: number;
    total_messages_sent: number;
}

export interface UserUsageStats {
    limits: UserLimits;
    current_usage: CurrentUsage;
    user_profile: {
        id: string;
        email: string;
        display_name: string;
        role: string;
    };
}

// UserUsageResponse tipi, UserUsageStats'ın yerine kullanılabilir
export interface UserUsageResponse {
    limits: UserLimits;
    current_usage: CurrentUsage;
    user_profile: {
        id: string;
        email: string;
        display_name: string;
        role: string;
    };
}