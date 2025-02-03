package features.MovieDetails;

import android.net.Uri;
import android.os.Bundle;
import android.util.Log;
import android.widget.MediaController;
import android.widget.VideoView;

import androidx.appcompat.app.AppCompatActivity;

import com.example.android_app.R;

public class MovieShowActivity extends AppCompatActivity {

    private VideoView videoView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_movie_show);

        videoView = findViewById(R.id.video_view);

        String videoUrl = getIntent().getStringExtra("VIDEO_URL");

        if (videoUrl != null && !videoUrl.isEmpty()) {
            videoUrl = videoUrl.replace("localhost", "10.0.2.2"); // Fix for Android emulator
            Log.d("MovieShowActivity", "Video URL: " + videoUrl);

            videoView.setVideoURI(Uri.parse(videoUrl));

            MediaController mediaController = new MediaController(this);
            mediaController.setAnchorView(videoView);
            videoView.setMediaController(mediaController);

            videoView.setOnPreparedListener(mp -> {
                Log.d("MovieShowActivity", "Video duration: " + mp.getDuration() + " ms");
                videoView.start();
            });

            videoView.setOnErrorListener((mp, what, extra) -> {
                Log.e("MovieShowActivity", "Error playing video: " + what + ", " + extra);
                return true; // Handled error
            });
        } else {
            Log.e("MovieShowActivity", "Invalid video URL");
        }
    }
}
