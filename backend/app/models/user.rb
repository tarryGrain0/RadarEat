class User < ApplicationRecord
    has_secure_password
  
    # メールアドレス: 必須・一意・形式チェック
    validates :email,
              presence: true,
              uniqueness: true,
              format: {
                with: /\A[^@\s]+@[^@\s]+\z/,
                message: 'の形式が正しくありません'
              }
  
    # パスワード: 必須・8文字以上・絵文字禁止
    validates :password,
              presence: true,
              length: { minimum: 8 },
              format: {
                without: /\p{Extended_Pictographic}/,
                message: 'に絵文字は使用できません'
              },
              if: :password_required?
  
    private
  
    def password_required?
      password_digest.blank? || !password.nil?
    end
  end