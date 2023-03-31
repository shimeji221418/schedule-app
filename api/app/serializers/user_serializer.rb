class UserSerializer < ActiveModel::Serializer
  attributes :id , :name , :email , :uid , :role, :team_id, :created_at
  belongs_to :team
end
