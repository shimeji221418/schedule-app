class ScheduleKind < ApplicationRecord
    has_many :schedules, dependent: :destroy
    validates :name, presence: true, uniqueness: true
    validates :color, presence: true, uniqueness: true
end
