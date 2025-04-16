class Api::SessionsController < ApplicationController
    include ActionController::Cookies
    require 'jwt'
    def create
      user = User.find_by(email: params[:email])
      if user&.authenticate(params[:password])
        payload = { user_id: user.id, exp: 7.days.from_now.to_i }
        token = JWT.encode(payload, Rails.application.secret_key_base, 'HS256')

        cookies.signed[:jwt] = {
          value: token,
          httponly: true,
          expires: 7.days.from_now,
          same_site: :lax,
          secure: Rails.env.production?
        }

        render json: { message: 'Login successful', token: token }
      else
        render json: { error: 'メールアドレスかパスワードのどちらかが間違っています' }, status: :unauthorized
      end
    end
  end