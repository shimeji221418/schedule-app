class User < ApplicationRecord
  belongs_to :team
  has_many :schedules, dependent: :destroy
  enum role: {general: 0, admin: 1}
  validates :name, uniqueness: true
  validates :email, uniqueness: true
end
