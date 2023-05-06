class Schedule < ApplicationRecord
  belongs_to :user
  belongs_to :schedule_kind
  validates :start_at, presence: true
  validates :end_at, presence: true
  validates :schedule_kind_id, presence: true
  validates :user_id, presence: true
  validates :description, length: { maximum: 100 }

  validate :overlap_create_schedule?, on: :create

  validate :overlap_update_schedule?, on: :update

  def overlap_create_schedule?
    if (Schedule.where("(end_at > ? AND ?  > start_at) AND user_id = ?", self.start_at, self.end_at, self.user_id).any?)
      errors.add(:base, "同時間帯に既に予定があります")
    end
  end

  def overlap_update_schedule?
     if (Schedule.where.not(id: id).where("(end_at > ? AND ?  > start_at) AND user_id = ?", self.start_at, self.end_at, self.user_id).any?)
     errors.add(:base, "同時間帯に既に予定があります")
     end
  end
end
