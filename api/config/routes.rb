Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  # root "articles#index"

  namespace "api" do
    namespace "v1" do
      get "users/current" => "users#current"
      get "users/team_users" => "users#team_users"
      get "schedules/weekly_team_schedules" =>"schedules#weekly_team_schedules"
      get "schedules/daily_team_schedules" => "schedules#daily_team_schedules"
      get "schedules/weekly_custum_schedules" =>"schedules#weekly_custum_schedules"
      get "schedules/daily_custum_schedules" => "schedules#daily_custum_schedules"
      get "schedules/my_schedules" => "schedules#my_schedules"
      resources :teams
      resources :users, only:[:index, :show, :update, :destroy]
      resources :schedules
      resources :schedule_kinds
      namespace "auth" do 
        post 'registrations' => 'registrations#create'
      end
    end
  end
end
