class ScheduleKind < ApplicationRecord
    has_many :schedules, dependent: :destroy
    validates :name, presence: true, uniqueness: true, length: { maximum: 20 }
    validates :color, presence: true, uniqueness: true
end
