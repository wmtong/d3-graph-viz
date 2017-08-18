module University
  extend ActiveSupport::Concern

  def getUniversityData
    # NODES
    @students = Student.all
    @courses = Course.all
    @professors = Professor.all

    student_nodes = []
    @students.each { |s|
      student_nodes << Hash['id' => 'student_' + s.student_id.to_s, 'group' => 'student', 'slug' => 'Student ' + s.student_id.to_s, 'intelligence' => s.intelligence, 'ranking' => s.ranking]
    }
    course_nodes = []
    @courses.each { |c|
      course_nodes << Hash['id' => 'course_' + c.course_id.to_s, 'group' => 'course', 'slug' => 'Course ' + c.course_id.to_s, 'rating' => c.rating, 'diff' => c.diff]
    }
    prof_nodes = []
    @professors.each { |pr|
      prof_nodes << Hash['id' => 'prof_' + pr.prof_id.to_s, 'group' => 'prof', 'slug' => 'Professor ' + pr.prof_id.to_s, 'popularity' => pr.popularity, 'teachingability' => pr.teachingability]
    }

    # LINKS
    @RA = RA.all
    ra_links = []
    @RA.each { |r|
      ra_links << Hash['source' => 'prof_' + r.prof_id.to_s, 'target' => 'student_' + r.student_id.to_s]
    }
    @registration = Registration.all
    registration_links = []
    @registration.each { |r|
      registration_links << Hash['source' => 'course_' + r.course_id.to_s, 'target' => 'student_' + r.student_id.to_s]
    }

    data = {"nodes": student_nodes + course_nodes + prof_nodes, "links": ra_links + registration_links}
    render json: {status: 'SUCCESS', message: 'Loaded all nav items', data: data}, status: :ok
  end
end
