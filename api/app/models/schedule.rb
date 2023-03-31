class Schedule < ApplicationRecord
  belongs_to :user
  belongs_to :schedule_kind
  validates :start_at, presence: true
  validates :end_at, presence: true
  validates :schedule_kind_id, presence: true
  validates :user_id, presence: true
end
