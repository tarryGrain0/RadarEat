class Api::BookmarksController < ApplicationController
    include ActionController::Cookies
    require 'jwt'
    require 'net/http'
    require 'json'
  
    before_action :authenticate_user!
  
    def index
      bookmarks = current_user.bookmarks.select(:id, :restaurant_id)
      render json: bookmarks
    end
  
    def list
      page = params[:page].to_i > 0 ? params[:page].to_i : 1
      per_page = params[:per_page].to_i > 0 ? params[:per_page].to_i : 10

      bookmarks = current_user.bookmarks.select(:restaurant_id)
      restaurant_ids = bookmarks.map(&:restaurant_id)

      shops = []
      restaurant_ids.each_slice(10) do |id_group|
        id_param = id_group.join(',')
        url = URI("https://webservice.recruit.co.jp/hotpepper/gourmet/v1/?key=#{ENV['HOTPEPPER_API_KEY']}&id=#{id_param}&format=json")
        res = Net::HTTP.get_response(url)
        json = JSON.parse(res.body)
        shops += json["results"]["shop"] || []
      end

      paginated_shops = shops.slice((page - 1) * per_page, per_page) || []
      render json: {
        current_page: page,
        total_count: shops.size,
        total_pages: (shops.size.to_f / per_page).ceil,
        shops: paginated_shops
      }
    end
  
    def create
      bookmark = current_user.bookmarks.new(restaurant_id: params[:restaurant_id])
      if bookmark.save
        render json: { message: 'Bookmark created', bookmark: bookmark }, status: :created
      else
        render json: { error: bookmark.errors.full_messages }, status: :unprocessable_entity
      end
    end
  
    def destroy
      bookmark = current_user.bookmarks.find_by(id: params[:id])
      if bookmark&.destroy
        render json: { message: 'Bookmark deleted' }
      else
        render json: { error: 'Bookmark not found or cannot be deleted' }, status: :not_found
      end
    end
  
    private
  
    def authenticate_user!
      token = cookies[:authToken]
      decoded = JWT.decode(token, Rails.application.secret_key_base, true, algorithm: 'HS256')
      @current_user = User.find(decoded[0]["user_id"])
    rescue
      render json: { error: 'Unauthorized' }, status: :unauthorized
    end
  
    def current_user
      @current_user
    end
  end