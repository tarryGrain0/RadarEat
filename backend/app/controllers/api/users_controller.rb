class Api::UsersController < ApplicationController
    include ActionController::Cookies
    require 'jwt'
    def create
      user = User.new(user_params)
      if user.save
        payload = { user_id: user.id, exp: 7.days.from_now.to_i }
        token = JWT.encode(payload, Rails.application.secret_key_base, 'HS256')

        cookies.signed[:jwt] = {
          value: token,
          httponly: true,
          expires: 7.days.from_now,
          same_site: :lax,
          secure: Rails.env.production?
        }

        render json: { message: 'User created and logged in', token: token }, status: :created
      else
        render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
      end
    end

    def destroy
        user = User.find_by(id: params[:id])
        if user
          user.destroy
          render json: { message: 'Account deleted successfully' }
        else
          render json: { error: 'User not found' }, status: :not_found
        end
      end
  
    private
  
    def user_params
      params.require(:user).permit(:email, :password, :password_confirmation)
    end
  end