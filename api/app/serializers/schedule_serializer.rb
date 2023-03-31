class ScheduleSerializer < ActiveModel::Serializer
  attributes :id, :start_at, :end_at, :is_locked, :description, :user_id, :schedule_kind_id, :created_at
  belongs_to :schedule_kind
  belongs_to :user
end
