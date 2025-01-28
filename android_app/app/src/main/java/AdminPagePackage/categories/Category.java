package AdminPagePackage;

import androidx.annotation.NonNull;
import androidx.room.Entity;
import androidx.room.PrimaryKey;

@Entity(tableName = "categories")
public class Category {
    @PrimaryKey
    @NonNull
    private String name;
    private boolean promoted;
    private String _id;

    @Override
    public String toString() {
        return "Category{" +
                "name='" + name +
                ", promoted=" + promoted +
                ", id='" + _id +
                '}';
    }

    public Category(String _id, String name, boolean promoted) {
        this._id = _id;
        this.name = name;
        this.promoted = promoted;
    }

    public String getId() {
        return _id;
    }

    public void setId(String _id) {
        this._id = _id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setPromoted(boolean promoted) {
        this.promoted = promoted;
    }

    public boolean isPromoted() {
        return promoted;
    }
}
