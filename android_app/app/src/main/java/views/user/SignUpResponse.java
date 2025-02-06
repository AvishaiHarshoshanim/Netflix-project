package views.user;

public class SignUpResponse {
    private String userName; 
    private String name;
    private String profile_image;  
    private String message; 

    public String getUserName() {
        return userName;
    }

    public String getName() {
        return name;
    }

    public String getProfileImage() {
        return profile_image;
    }

    public String getMessage() {
        return message;
    }
}