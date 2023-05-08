class Api::V1::ScheduleKindsController < Api::V1::ApplicationController
    before_action :set_schedule_kind, only:[:show, :update, :destroy]
    before_action :check_admin, only:[:show, :create, :update, :destroy]

    def index
        schedule_kinds = ScheduleKind.all.order(created_at: :desc)
        render status: 200, json: schedule_kinds
    end

    def show
        render status: 200, json: @schedule_kind
    end

    def create
        schedule_kind = ScheduleKind.new(schedule_kind_params)
        if schedule_kind.save
            render status: 201, json: schedule_kind
        else
            render status: 400, json: {data: schedule_kind.errors}
        end
    end

    def update
        if @schedule_kind.update(schedule_kind_params)
            render status: 200, json: @schedule_kind
        else
            render status: 400, json: {data: @schedule_kind.errors}
        end
    end

    def destroy
        if @schedule_kind.destroy
            render status: 200, json: @schedule_kind
        else
            render status: 400, json: {data: @schedule_kind.errors}
        end
    end

    private

    def set_schedule_kind
        @schedule_kind = ScheduleKind.find(params[:id])
    end

    def schedule_kind_params
        params.require(:schedule_kind).permit(:name, :color)
    end
end
