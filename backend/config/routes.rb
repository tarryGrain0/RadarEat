Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check

  namespace :api do
    resources :restaurant_searches, only: [:index, :show] do
      collection do
        post :location
      end
    end
    resources :users, only: [:create, :destroy]
    post 'login', to: 'sessions#create'

    resources :bookmarks, only: [:index, :create, :destroy]
    get 'bookmarks/list', to: 'bookmarks#list'
  end

end
