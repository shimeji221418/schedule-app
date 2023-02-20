class Api::V1::TeamsController < Api::V1::ApplicationController
    before_action :set_team, only:[:show, :update, :destroy]
    before_action :check_admin

    def index
        teams = Team.all.order(created_at: :desc)
        render status: 200, json: teams
    end

    def show
        render status: 200, json: @team
    end

    def create
        team = Team.create(team_params)
        if team 
            render status: 201, json: team
        else
            render status: 400, json: {data: team.errors}
        end
    end

    def update
        if @team.update(team_params)
            render status: 200, json: @team
        else
            render status: 400, json: {data: @team.errors}
        end
    end

    def destroy
        if @team.destroy
            render status: 200, json: @team
        else
            render status: 400, json: {data: @team.errors}
        end
    end

    private

    def set_team
        @team = Team.find(params[:id])
    end

    def team_params
        params.require(:team).permit(:name)
    end

end
