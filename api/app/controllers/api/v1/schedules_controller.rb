class Api::V1::SchedulesController < Api::V1::ApplicationController
    before_action :set_schedule, only:[:show, :update, :destroy]

    def index
        schedules = Schedule.all.order(created_at: :desc)
        render status: 200, json: schedules
    end

    def show
        render status: 200, json: @schedule
    end

    def create
        schedule = Schedule.create(schedule_params)
        if schedule
            render status: 201, json: schedule
        else
            render status: 400, json: {data: schedule.errors}
        end
    end

    def update
        if @schedule.update(schedule_params)
            render status: 200, json: @schedule
        else
            render status: 400, json: {data: @schedule.errors}
        end
    end

    def destroy
        if @schedule.destroy
            render status: 200, json: @schedule
        else
            render status: 400, json: {data: @schedule.errors}
        end
    end

    def weekly_team_schedules
        start_date, end_date = get_start_and_end_date
        ids = User.where(team_id: params[:team_id]).ids
        schedules = Schedule.where(user_id: ids, start_at: start_date...end_date)
        if schedules
            render status: 200, json: schedules
        else
            render status: 400, json:{data: "schedule is noting"}
        end
    end

    def weekly_custom_schedules
        start_date, end_date = get_start_and_end_date
        ids = params[:user_ids].split(',') # "?user_ids=1,2,4"
        pp "====="
        pp ids
        pp "====="
        schedules = Schedule.where(user_id: ids, start_at: start_date...end_date)
        pp schedules
        if schedules
            render status: 200, json: schedules
        else
            render status: 400, json:{data: "schedule is noting"}
        end
    end

    def daily_team_schedules
        start_date, end_date = get_start_and_end_date(false)
        ids = User.where(team_id: params[:team_id]).ids
        schedules = Schedule.where(user_id: ids, start_at: start_date...end_date)
        if schedules
            render status: 200, json: schedules
        else
            render status: 400, json:{data: "schedule is noting"}
        end
    end

    def daily_custom_schedules
        start_date, end_date = get_start_and_end_date(false)
        ids = params[:user_ids].split(',')
        schedules = Schedule.where(user_id: ids, start_at: start_date...end_date)
        if schedules
            render status: 200, json: schedules
        else
            render status: 400, json:{data: "schedule is noting"}
        end
    end

    def my_schedules
        start_date, end_date = get_start_and_end_date
        schedules = Schedule.where(user_id: params[:user_id], start_at: start_date ... end_date)
        if schedules
            render status: 200, json: schedules
        else
            render status: 400, json:{data: "schedule is noting"}
        end
    end
    

    private

    def set_schedule
        @schedule = Schedule.find(params[:id])
    end

    def schedule_params
        params.require(:schedule).permit(:start_at, :end_at, :is_locked, :description, :user_id, :schedule_kind_id,:user_ids)
    end

    def get_start_and_end_date(is_weekly=true)
        start_date = Date.parse(params[:date]).beginning_of_day
        end_date = is_weekly ? (start_date + 6.day).end_of_day : Date.parse(params[:date]).end_of_day
        [start_date, end_date]
    end
end
