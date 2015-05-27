# 456710fb9b2e4234d74aa49f10c5a3619ef97847

class ExercisesController < ApplicationController

  def show
  	@exercise = Exercise.find(params[:id])
  end

  def index
 	@exercises = Exercise.all
 	if params[:search]
 		@exercises = Exercise.search(params[:search]).limit(30)
 	else
 		@exercises = Exercise.all.limit(30).order('name ASC')
 	end
  end

  def new
  	@exercise = Exercise.new
  end

  def create
  	Exercise.create(exercise_params)
  	redirect_to(exercises_path)
  end

  private 
  	def exercise_params
  		params.require(:exercise).permit(:name, :description, :search)
  	end

end
