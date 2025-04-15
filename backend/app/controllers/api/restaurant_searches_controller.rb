class Api::RestaurantSearchesController < ApplicationController
    def index
      query = params[:q].to_s
      page = params[:page] || 1
      per_page = 10

      api_key = ENV['HOTPEPPER_API_KEY']
      api_url = "http://webservice.recruit.co.jp/hotpepper/gourmet/v1/?key=#{api_key}&keyword=#{query}&format=json"

      restaurants = Restaurant.where("name ILIKE ?", "%#{query}%")
                              .page(page).per(per_page)
  
      render json: {
        results: restaurants.as_json(only: [:id, :name]),
        currentPage: restaurants.current_page,
        totalPages: restaurants.total_pages,
        totalCount: restaurants.total_count
      }
    end

    def location
      lat = params[:latitude]
      lng = params[:longitude]
      range = (params[:range] || 3).to_i.clamp(1, 5)
      page = (params[:page] || 1).to_i
      per_page = 10

      api_key = ENV['HOTPEPPER_API_KEY']

      begin
        Rails.logger.info "Requesting Hotpepper API with: lat=#{lat}, lng=#{lng}, range=#{range}, page=#{page}"

        response = HTTParty.get("https://webservice.recruit.co.jp/hotpepper/gourmet/v1/", {
          query: {
            key: api_key,
            lat: lat,
            lng: lng,
            range: range,
            format: "json",
            count: per_page,
            start: (page - 1) * per_page + 1
          }
        })

        Rails.logger.info "Hotpepper API response: #{response.body}"

        json = JSON.parse(response.body)

        if json["results"] && json["results"]["shop"]
          shops = json["results"]["shop"].map do |shop|
            {
              id: shop["id"],
              name: shop["name"],
              address: shop["address"],
              logo_image: shop.dig("logo_image") || nil,
              url: shop["urls"]["pc"],
              access: shop["access"],
              image_error: false
            }
          end

          total_count = json["results"]["results_available"].to_i
          total_pages = [(total_count.to_f / per_page).ceil, 1].max

          render json: {
            results: shops.map { |shop| shop.merge(logo_image: shop[:logo_image].present? ? shop[:logo_image] : '/no-image.png') },
            currentPage: page,
            totalCount: shops.length,
            totalAvailable: total_count,
            totalPages: total_pages,
            raw: json
          }
        else
          render json: { results: [], currentPage: page, totalCount: 0, totalPages: 1, raw: json }
        end
      rescue => e
        Rails.logger.error "Error in location action: #{e.class} - #{e.message}"
        render json: { error: "Internal Server Error", details: e.message }, status: 500
      end
    end

    def show
      shop_id = params[:id]
      api_key = ENV['HOTPEPPER_API_KEY']

      begin
        Rails.logger.info "Requesting Hotpepper API for shop_id: #{shop_id}"

        response = HTTParty.get("https://webservice.recruit.co.jp/hotpepper/gourmet/v1/", {
          query: {
            key: api_key,
            id: shop_id,
            format: "json"
          }
        })

        json = JSON.parse(response.body)
        shop = json.dig("results", "shop", 0)

        if shop
          render json: {
            logo_image: shop.dig("logo_image") || "/no-image.png",
            id: shop["id"],
            name: shop["name"],
            address: shop["address"],
            url: shop["urls"]["pc"],
            access: shop["access"],
            genre: shop.dig("genre").is_a?(Hash) ? shop["genre"]["name"] : shop.dig("genre") || '情報なし',
            sub_genre: shop.dig("sub_genre").is_a?(Hash) ? shop["sub_genre"]["name"] : shop.dig("sub_genre") || '情報なし',
            budget: shop.dig("budget").is_a?(Hash) ? shop["budget"]["average"] : shop.dig("budget"),
            open: shop.dig("open"),
            close: shop.dig("close"),
            capacity: shop.dig("capacity"),
            course: shop.dig("course"),
            free_drink: shop.dig("free_drink"),
            free_food: shop.dig("free_food"),
            private_room: shop.dig("private_room"),
            card: shop.dig("card"),
            non_smoking: shop.dig("non_smoking"),
            parking: shop.dig("parking"),
            child: shop.dig("child")
          }
        else
          render json: { error: "Shop not found" }, status: :not_found
        end
      rescue => e
        Rails.logger.error "Error in show action: #{e.class} - #{e.message}"
        render json: { error: "Internal Server Error", details: e.message }, status: 500
      end
    end
  end