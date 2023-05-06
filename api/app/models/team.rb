class Team < ApplicationRecord
    has_many :users, dependent: :destroy
    validates :name, presence: true, length: { maximum: 20 }
end
